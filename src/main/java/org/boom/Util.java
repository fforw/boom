package org.boom;

import java.beans.BeanInfo;
import java.beans.Introspector;
import java.beans.PropertyDescriptor;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.StringTokenizer;

import org.apache.log4j.Logger;

public class Util
{
    protected static Logger log = Logger.getLogger(Util.class);

    public static List<String> split(String s, String delim)
    {
        if (s == null)
        {
            return Collections.emptyList();
        }
        
        StringTokenizer tokenizer = new StringTokenizer(s, delim);
        List<String> l = new ArrayList<String>();
        while (tokenizer.hasMoreTokens())
        {
            l.add(tokenizer.nextToken());
        }

        return l;
    }

    public static String join(Collection<?> l, String separator)
    {
        StringBuilder sb = new StringBuilder();
        boolean first = true;
        for (Object s : l)
        {
            if (!first)
            {
                sb.append(separator);
            }
            sb.append(s);
            first = false;
        }
        return sb.toString();
    }

    public static String joinWords(List<String> l)
    {
        StringBuilder sb = new StringBuilder();
        boolean first = true;
        for (String s : l)
        {

            if (!first)
            {
                sb.append(' ');
            }

            if (s.indexOf(' ') >= 0)
            {
                sb.append('"');
                sb.append(s.replace("\\", "\\\\").replace("\"","\\\""));
                sb.append('"');
            }
            else
            {
                sb.append(s);
            }
            first = false;
        }
        return sb.toString();
    }

    /**
     * Splits a text into words separated by spaces; also
     * handles single and double quoted words.
     *
     * @param text
     * @return
     */
    public static List<String> splitWords(String text)
    {
        List<String> words = new ArrayList<String>();

        StringBuilder sb=new StringBuilder();

        boolean inQuote = false;
        char quoteChar=0;

        for (int i = 0; i < text.length(); i++)
        {
            char c = text.charAt(i);

            if ((c == '"') && !isEscapedQuote(text, i) && (!inQuote || quoteChar == c))
            {
                inQuote = !inQuote;
                if (!inQuote)
                {
                    addWord(words,sb, false);
                }
                else
                {
                    addWord(words,sb, true);
                    quoteChar=c;
                }
            }
            else if (c == ' ' && !inQuote)
            {
                addWord(words,sb, true);
            }
            else if (c == '\\')
            {
                if (i > 0 && text.charAt(i-1) == '\\')
                {
                    sb.append(c);
                }
            }
            else
            {
                sb.append(c);
            }
        }
        if (inQuote)
        {
            throw new IllegalArgumentException("Unclosed quote");
        }
        addWord(words,sb, true);
        return words;
    }

    private static void addWord(List<String> words, StringBuilder sb, boolean ignoreEmpty)
    {

        if (sb.length() > 0 || !ignoreEmpty)
        {
            words.add(sb.toString());
            sb.setLength(0);
        }
    }

    private static boolean isEscapedQuote(String text, int i)
    {
        if (i == 0)
        {
            return false;
        }
        int cnt = 0;
        while (i > 0 && text.charAt(--i) == '\\')
        {
            cnt++;
        }
        return (cnt & 1) != 0;
    }

    /**
     * Converts illegal Characters to HTML entities. The method tries to use
     * named entities where possible. otherwise a numerical entity is used.
     *
     * @param text
     *            Text to encode
     * @param convertTags
     *            if <CODE>true</CODE>, HTML tags are readable as text (
     *            &quot;&lt;b&gt;&quot; becomes &quot;&amp;lt;b&amp;gt;&quot; ).
     *
     * @return encoded text
     */
    public static String unicodeHtmlEscape(String text, boolean convertTags)
    {
        if (text == null)
        {
            return "";
        }

        StringBuffer out = new StringBuffer(text.length() * 2);

        char c;
        for (int i = 0; i < text.length(); i++)
        {
            c = text.charAt(i);
            if (c >= 128
                    || (convertTags && (c == '<' || c == '>' || c == '&' || c == '"') || c == '\''))
            {
                switch (c)
                {
                    case 8222:
                    case 8220:
                        out.append('\"');
                        break;
                    case '\'':
                    case 8217:
                        out.append("&apos;");
                        break;
                    case '"':
                        out.append("&quot;");
                        break;
                    case '&':
                        out.append("&amp;");
                        break;
                    case '<':
                        out.append("&lt;");
                        break;
                    case '>':
                        out.append("&gt;");
                        break;
                    case '\u00A0':
                        out.append("&nbsp;");
                        break;
                    case '\u00A1':
                        out.append("&iexcl;");
                        break;
                    case '\u00A2':
                        out.append("&cent;");
                        break;
                    case '\u00A3':
                        out.append("&pound;");
                        break;
                    case '\u00A4':
                        out.append("&curren;");
                        break;
                    case '\u00A5':
                        out.append("&yen;");
                        break;
                    case '\u00A6':
                        out.append("&brvbar;");
                        break;
                    case '\u00A7':
                        out.append("&sect;");
                        break;
                    case '\u00A8':
                        out.append("&uml;");
                        break;
                    case '\u00A9':
                        out.append("&copy;");
                        break;
                    case '\u00AA':
                        out.append("&ordf;");
                        break;
                    case '\u00AB':
                        out.append("&laquo;");
                        break;
                    case '\u00AC':
                        out.append("&not;");
                        break;
                    case '\u00AD':
                        out.append("&shy;");
                        break;
                    case '\u00AE':
                        out.append("&reg;");
                        break;
                    case '\u00AF':
                        out.append("&macr;");
                        break;
                    case '\u00B0':
                        out.append("&deg;");
                        break;
                    case '\u00B1':
                        out.append("&plusmn;");
                        break;
                    case '\u00B2':
                        out.append("&sup2;");
                        break;
                    case '\u00B3':
                        out.append("&sup3;");
                        break;
                    case '\u00B4':
                        out.append("&acute;");
                        break;
                    case '\u00B5':
                        out.append("&micro;");
                        break;
                    case '\u00B6':
                        out.append("&para;");
                        break;
                    case '\u00B7':
                        out.append("&middot;");
                        break;
                    case '\u00B8':
                        out.append("&cedil;");
                        break;
                    case '\u00B9':
                        out.append("&sup1;");
                        break;
                    case '\u00BA':
                        out.append("&ordm;");
                        break;
                    case '\u00BB':
                        out.append("&raquo;");
                        break;
                    case '\u00BC':
                        out.append("&frac14;");
                        break;
                    case '\u00BD':
                        out.append("&frac12;");
                        break;
                    case '\u00BE':
                        out.append("&frac34;");
                        break;
                    case '\u00BF':
                        out.append("&iquest;");
                        break;
                    case '\u00C0':
                        out.append("&Agrave;");
                        break;
                    case '\u00C1':
                        out.append("&Aacute;");
                        break;
                    case '\u00C2':
                        out.append("&Acirc;");
                        break;
                    case '\u00C3':
                        out.append("&Atilde;");
                        break;
                    case '\u00C4':
                        out.append("&Auml;");
                        break;
                    case '\u00C5':
                        out.append("&Aring;");
                        break;
                    case '\u00C6':
                        out.append("&AElig;");
                        break;
                    case '\u00C7':
                        out.append("&Ccedil;");
                        break;
                    case '\u00C8':
                        out.append("&Egrave;");
                        break;
                    case '\u00C9':
                        out.append("&Eacute;");
                        break;
                    case '\u00CA':
                        out.append("&Ecirc;");
                        break;
                    case '\u00CB':
                        out.append("&Euml;");
                        break;
                    case '\u00CC':
                        out.append("&Igrave;");
                        break;
                    case '\u00CD':
                        out.append("&Iacute;");
                        break;
                    case '\u00CE':
                        out.append("&Icirc;");
                        break;
                    case '\u00CF':
                        out.append("&Iuml;");
                        break;
                    case '\u00D0':
                        out.append("&ETH;");
                        break;
                    case '\u00D1':
                        out.append("&Ntilde;");
                        break;
                    case '\u00D2':
                        out.append("&Ograve;");
                        break;
                    case '\u00D3':
                        out.append("&Oacute;");
                        break;
                    case '\u00D4':
                        out.append("&Ocirc;");
                        break;
                    case '\u00D5':
                        out.append("&Otilde;");
                        break;
                    case '\u00D6':
                        out.append("&Ouml;");
                        break;
                    case '\u00D7':
                        out.append("&times;");
                        break;
                    case '\u00D8':
                        out.append("&Oslash;");
                        break;
                    case '\u00D9':
                        out.append("&Ugrave;");
                        break;
                    case '\u00DA':
                        out.append("&Uacute;");
                        break;
                    case '\u00DB':
                        out.append("&Ucirc;");
                        break;
                    case '\u00DC':
                        out.append("&Uuml;");
                        break;
                    case '\u00DD':
                        out.append("&Yacute;");
                        break;
                    case '\u00DE':
                        out.append("&THORN;");
                        break;
                    case '\u00DF':
                        out.append("&szlig;");
                        break;
                    case '\u00E0':
                        out.append("&agrave;");
                        break;
                    case '\u00E1':
                        out.append("&aacute;");
                        break;
                    case '\u00E2':
                        out.append("&acirc;");
                        break;
                    case '\u00E3':
                        out.append("&atilde;");
                        break;
                    case '\u00E4':
                        out.append("&auml;");
                        break;
                    case '\u00E5':
                        out.append("&aring;");
                        break;
                    case '\u00E6':
                        out.append("&aelig;");
                        break;
                    case '\u00E7':
                        out.append("&ccedil;");
                        break;
                    case '\u00E8':
                        out.append("&egrave;");
                        break;
                    case '\u00E9':
                        out.append("&eacute;");
                        break;
                    case '\u00EA':
                        out.append("&ecirc;");
                        break;
                    case '\u00EB':
                        out.append("&euml;");
                        break;
                    case '\u00EC':
                        out.append("&igrave;");
                        break;
                    case '\u00ED':
                        out.append("&iacute;");
                        break;
                    case '\u00EE':
                        out.append("&icirc;");
                        break;
                    case '\u00EF':
                        out.append("&iuml;");
                        break;
                    case '\u00F0':
                        out.append("&eth;");
                        break;
                    case '\u00F1':
                        out.append("&ntilde;");
                        break;
                    case '\u00F2':
                        out.append("&ograve;");
                        break;
                    case '\u00F3':
                        out.append("&oacute;");
                        break;
                    case '\u00F4':
                        out.append("&ocirc;");
                        break;
                    case '\u00F5':
                        out.append("&otilde;");
                        break;
                    case '\u00F6':
                        out.append("&ouml;");
                        break;
                    case '\u00F7':
                        out.append("&divide;");
                        break;
                    case '\u00F8':
                        out.append("&oslash;");
                        break;
                    case '\u00F9':
                        out.append("&ugrave;");
                        break;
                    case '\u00FA':
                        out.append("&uacute;");
                        break;
                    case '\u00FB':
                        out.append("&ucirc;");
                        break;
                    case '\u00FC':
                        out.append("&uuml;");
                        break;
                    case '\u00FD':
                        out.append("&yacute;");
                        break;
                    case '\u00FE':
                        out.append("&thorn;");
                        break;
                    case '\u00FF':
                        out.append("&yuml;");
                        break;
                    case 8364:
                    case 128:
                        out.append("&euro;");
                        break;
                    default:
                        out.append("&#").append((int) c).append(';');
                        break;
                }
            }
            else
            {
                out.append(c);
            }
        }
        return out.toString();
    }

    public static String toString(Object o)
    {
        StringBuilder sb = new StringBuilder();
        Class<? extends Object> cls = o.getClass();
        sb.append(cls).append('@').append(Integer.toHexString(o.hashCode())).append(" : ");

        try
        {
            BeanInfo info;
            info = Introspector.getBeanInfo(cls);

            boolean first = true;
            for (PropertyDescriptor desc : info.getPropertyDescriptors())
            {
                Method m = desc.getReadMethod();
                if (m != null)
                {
                    if (!first)
                    {
                        sb.append(", ");
                    }
                    sb.append(desc.getName()).append(" = ").append(m.invoke(o));
                    first = false;
                }
            }

        }
        catch (Exception e)
        {
            log.error("", e);
            sb.append("*ERROR*");
        }

        return sb.toString();
    }
}
